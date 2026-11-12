CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sgemv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sgemv: sgemv.c $(HDRS) | $(BIN)
	$(CC) sgemv.c -o $(BIN)/sgemv -lcublas

clean:
	rm -rf $(BIN)

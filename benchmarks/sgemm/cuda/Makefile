CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sgemm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sgemm: sgemm.c $(HDRS) | $(BIN)
	$(CC) sgemm.c -o $(BIN)/sgemm -lcublas

clean:
	rm -rf $(BIN)

CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dgemv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dgemv: dgemv.c $(HDRS) | $(BIN)
	$(CC) dgemv.c -o $(BIN)/dgemv -lcublas

clean:
	rm -rf $(BIN)

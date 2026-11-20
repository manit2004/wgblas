CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dtrsm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dtrsm: dtrsm.c $(HDRS) | $(BIN)
	$(CC) dtrsm.c -o $(BIN)/dtrsm -lcublas

clean:
	rm -rf $(BIN)
